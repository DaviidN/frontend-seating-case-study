import { Seat } from '@/components/Seat.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Button } from '@/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu.tsx';
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';
import { useState, useEffect } from "react";
import './App.css';

 interface Session {
    message: string,
	user: {
		firstName: string,
		lastName: string,
		email: string
		}
  }

  interface EventInfo {
	eventId: number,
	namePub: string,
	description: string,
	currencyIso: string,
	dateFrom: Date,
	dateTo: Date,
	headerImageUrl: string,
	place: string
  }

  interface EventTickets{
	ticketTypes: [
	{
		id: number,
		name: string,
		price: number
	}],
	seatRows: [
	{
		seatRow: number,
		seats: [
		{
			seatId: number,
			place: number,
			ticketTypeId: number
		}]
	}]
  }
  

function App() {
	const userPassword = "Nfctron2025" 
	const userEmail = "frontend@nfctron.com"
	const [userSess, setUserSess] = useState<Session[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [eventInfo, setEventInfo] = useState<EventInfo[]>([]);
	const [eventTickets, setEventTickets] = useState<EventTickets[]>([]);
	

	async function sendLogInfo(userEmail: string, userPassword: string) {

		try{
        const response = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: userEmail, password: userPassword })
        });

        const user = await response.json();
		
		localStorage.setItem("session", JSON.stringify(user));
		setUserSess([user]);
		setIsLoggedIn(true)

		} catch(e){
			console.error(e)
		} 
	}

	async function getEvent (){
		try{
			const response = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/event")
			const event = await response.json()

			setEventInfo([event]);	

		} catch(e){
			console.error(e)
		} 
	}

	async function getEventTickets (eventId: number){
		try{
			const response = await fetch(`https://nfctron-frontend-seating-case-study-2024.vercel.app/event-tickets?eventId=${eventId}`)
			const tickets = await response.json()

			setEventTickets([tickets])
			console.log(eventTickets);


		} catch(e){
			console.error(e)
		}
	}

	useEffect(() => {
		getUser();
		getEvent();
	}, [])

	useEffect(() => {
		if (eventInfo[0]?.eventId) { 
			getEventTickets(eventInfo[0].eventId);
		}
	}, [eventInfo])
	
	useEffect(() => {
		if (isLoggedIn) {
			setIsOpen(true);
		
			const timer = setTimeout(() => {
				setIsOpen(false); 
				setIsLoggedIn(false)
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [isLoggedIn]);  

	function Logout () {
        localStorage.clear();
        window.location.reload();
    }
	
	function getUser() {
		const sessionString = localStorage.getItem("session");

		if (!sessionString) {
			return null
		}
		return setUserSess([JSON.parse(sessionString)]);	
	}

	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<div className="bg-zinc-100 rounded-md size-12" />
					</div>
					{/* app/author title/name placeholder */}
					<div className="bg-zinc-100 rounded-md h-8 w-[200px]" />
					{/* user menu */}
					<div className="max-w-[250px] w-full flex justify-end">
						{ 
							userSess[0] ? (
								<>
								{userSess.map((props, key) => (									
								<div key={key}>
									<Popover open={isOpen} onOpenChange={setIsOpen}>	
										<PopoverTrigger>
										</PopoverTrigger>
										<PopoverContent > 
											<p>{props.message}</p>
										</PopoverContent>
									</Popover>		
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="secondary">
													<div className="flex items-center gap-2">
														<Avatar>
															<AvatarImage src={`https://source.boringavatars.com/marble/120/${props.user.email}?colors=25106C,7F46DB`} />
															<AvatarFallback>CN</AvatarFallback>
														</Avatar>
														<div className="flex flex-col text-left">
															<span className="text-sm font-medium">{`${props.user.firstName} ${props.user.lastName}`}</span>
															<span className="text-xs text-zinc-500">{props.user.email}</span>
														</div>
													</div>
											</Button>
										</DropdownMenuTrigger>						
										<DropdownMenuContent className="w-[250px]">
											<DropdownMenuLabel>{`${props.user.firstName} ${props.user.lastName}`}</DropdownMenuLabel>
											<DropdownMenuSeparator />
											<DropdownMenuGroup>
												<DropdownMenuItem onClick={() => Logout ()}>
													Logout
												</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
										</DropdownMenu>
									</div>
									))}
									</>
							) : (	
								<Button variant="secondary" onClick={() => sendLogInfo(userEmail, userPassword)}>
									Login or register 
								</Button>			
							)
						}
						</div>
				</div>
			</nav>
			
			{/* main body (wrapper) */}
			<main className="grow flex flex-col justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg m-auto p-4 flex items-start grow gap-3 w-full">
					{/* seating card */}
					<div className="bg-white rounded-md grow grid p-3 self-stretch shadow-sm" style={{
						gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
						gridAutoRows: '40px'
					}}>
						{/*	seating map */}
						{
							Array.from({ length: 100 }, (_, i) => (
								<Seat key={i} />
							))
						}
					</div>
					
					{/* event info */}
					{eventInfo.map((props)=>(

						<aside key={props.eventId} className="w-full max-w-sm bg-white rounded-md shadow-sm p-3 flex flex-col gap-2">
						{/* event header image placeholder */}
						<img className="bg-zinc-100 rounded-md h-50" src={props.headerImageUrl}  />
						{/* event name */}
						<h1 className="text-xl text-zinc-900 font-semibold">{props.namePub}</h1>
						{/* event description */}
						<p className="text-sm text-zinc-500">{props.description}</p>
						{/* add to calendar button */}
						<Button variant="secondary">
							Add to calendar
						</Button>
						</aside>
					))}
				</div>
			</main>
			
			{/* bottom cart affix (wrapper) */}
			<nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-6 flex justify-between items-center gap-4 grow">
					{/* total in cart state */}
					<div className="flex flex-col">
						<span className="text-zinc-500">Total for [?] tickets</span>
						<span className="text-2xl font-semibold text-zinc-900  ">[?] {eventInfo[0]?.currencyIso}</span>
					</div>
					
					{/* checkout button */}
					<Button variant="default">
						Checkout now
					</Button>
				</div>
			</nav>
		</div>
	);
}

export default App;
