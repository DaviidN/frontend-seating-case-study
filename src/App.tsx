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
import profilePic from "./imgs/Profilovy_obrazek1.jpg"

 interface Session {
    message: string,
	user: User
  }

  interface User {
	firstName: string,
	lastName: string,
	email: string,
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
	ticketTypes: [{
		id: string,
		name: string,
		price: number
	}],
	seatRows: [{
		seatRow: number,
		seats: [
		{
			seatId:number,
			place: number,
			ticketTypeId: string
		}]
	}]
  }
  
  interface InCartTickets {
	ticketTypeId: string,
    seatId: number
  }

  interface OrderResponse{
	message: string, 
	orderId: string,
	tickets: InCartTickets[],
	user: User,
	totalAmount: number
  }

function App() {
	const userPassword = "Nfctron2025" 
	const userEmail = "frontend@nfctron.com"
	const [userSess, setUserSess] = useState<Session[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const [openPopOver, setOpenPopOver] = useState(false);
	const [eventInfo, setEventInfo] = useState<EventInfo[]>([]);
	const [eventTickets, setEventTickets] = useState<EventTickets[]>([]);
	const [totalPrice, setTotalPrice] = useState(0);
	const [cart, setCart] = useState<InCartTickets[]>([]);
	const [orderResponse, setOrderResponse] = useState<OrderResponse>({message: "", orderId: "",tickets:[], user:{firstName:"",lastName:"",email:""}, totalAmount:0});
	const [hostEmail, setHostEmail] = useState("")
	const [hostFirstName, setHostFirstName] = useState("")
	const [hostLastName, setHostLastName] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [language, setLanguage] = useState(true)

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
		setOpenPopOver(true)

		} catch(e){
			console.error(e)
		} 
	}

	async function sendOrder(eventId: number, tickets: InCartTickets[], user: User ) {
		setIsLoading(true)

		try{
        const response = await fetch("https://nfctron-frontend-seating-case-study-2024.vercel.app/order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ eventId: eventId, tickets: tickets, user: user })
        });

        const order = await response.json();
		console.log(order);
		
		setOrderResponse(order)
		setOpenPopOver(true)

		} catch(e){
			console.error(e)
		} finally{
			setIsLoading(false)
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
		if (openPopOver) {
			setIsOpen(true);
		
			const timer = setTimeout(() => {
				setIsOpen(false); 
				setOpenPopOver(false)
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [openPopOver]);  

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
	
	function addToCart (typeID: string, seatID: number, price: number){
		setTotalPrice(totalPrice + price);
		setCart([...cart, {ticketTypeId:typeID , seatId: seatID}]);
	}
	
	function deleteFromCart (seatID: number, price: number){
		setTotalPrice(totalPrice - price);
		setCart(cart.filter(ticket => ticket.seatId !== seatID));
	}
	
	async function AddEventToCalendar (event: EventInfo){
		const googleCalendarURL = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.namePub)}&dates=${event.dateFrom}/${event.dateTo}&location=${encodeURIComponent(event.place)}&details=${encodeURIComponent(event.description)}`;
		try{
			window.open(googleCalendarURL, '_blank');
		} catch(e){
			console.error(e)
		} 
	}

	return (
		<div className="flex flex-col grow">
			{/* header (wrapper) */}
			<nav className="sticky top-0 left-0 right-0 bg-white border-b border-zinc-200 flex justify-center">
				{/* inner content */}
				<div className="max-w-screen-lg p-4 grow flex items-center justify-between gap-3">
					{/* language change button */}
					<Button  onClick={() => setLanguage(!language)}>
						{ language ? 
						"eng" 
						: 
						"cze"
						}	
					</Button>
					{/* application/author image/logo placeholder */}
					<div className="max-w-[250px] w-full flex">
						<img src={profilePic} alt="Authors image" className="bg-zinc-100 rounded-md size-12" />
					</div>
						{/* login and order popover */}
						<Popover open={isOpen} onOpenChange={setIsOpen}>
							<PopoverTrigger>
							</PopoverTrigger>
							<PopoverContent className="flex justify-center"	
							> 		
							{
							orderResponse.message? 
								<span className="text-center">{orderResponse.message === "Invalid request body" ? "Fill valid credentials" : orderResponse.message }</span>

							: 	
								<span  className="text-center">{userSess?.[0]?.message}</span>
							}
							</PopoverContent>
						</Popover>
					{/* app/author title/name placeholder */}
					<span className="flex items-center justify-center text-center bg-zinc-100 rounded-md h-8 w-[200px] text-sm text-black">Bc. Novotný David</span>

					{/* user menu */}
					<div className="max-w-[250px] w-full flex justify-end">
						{ 
							userSess[0] ? (
								<>
								{userSess.map((props, key) => (									
								<div key={key}>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="secondary">
													<div className="flex items-center gap-2">
														<Avatar>
															<AvatarImage src={`https://boringavatars.com/marble/120/${props.user.email}?colors=25106C,7F46DB`} />
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
													{language ? 
													"Logout" 
													: 
													"Odlhášení"
													}
												</DropdownMenuItem>
											</DropdownMenuGroup>
										</DropdownMenuContent>
										</DropdownMenu>
									</div>
									))}
									</>
							) : (	
								<Button variant="secondary" onClick={() => sendLogInfo(userEmail, userPassword)}>
									{language ? 
									"Login or register "
									: 
									"Přihlášení nebo registrace" 
									}
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
					<div className="flex overflow-auto bg-white rounded-md grow grid p-3 self-stretch shadow-sm" style={{
						gridTemplateColumns: 'repeat(auto-fill, minmax(40px, 1fr))',
						gridAutoRows: '40px'
					}}>
						{/*	seating map */}
						<div className="flex flex-col gap-3">
							{eventTickets.map((tickets) =>
								tickets.seatRows.map((row) => (
									<div key={row.seatRow} className="flex gap-3 items-center">
										<span className="text-sm text-zinc-900 font-bold w-6">{language? "Row"  : "Řada" }</span>
										<span className="text-sm text-zinc-500 font-bold w-6">{row.seatRow}</span>								
										{row.seats.map((seat) => (
										tickets.ticketTypes.map((type) =>(type.id === seat.ticketTypeId ? <Seat addToCart={addToCart} deleteFromCart={deleteFromCart} key={seat.seatId} seat={seat} type={type} /> :
											null
										))
										))}
									</div>
									))
							)}
						</div>
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
						<Button variant="secondary" onClick={() => AddEventToCalendar(props)}>
							{language ? 
							"Add to google calendar" 
							: 
							"Přidat do google kalendáře"
							}
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
						<span className="text-zinc-500">{language ? `Total for ${cart.length} tickets` : `Celkem za ${cart.length} vstupenek`}</span>
						<span className="text-2xl font-semibold text-zinc-900  ">{totalPrice} {eventInfo[0]?.currencyIso}</span>
					</div>
					
					{/* checkout button */}	
					{ userSess[0] ? 
						<Button disabled={isLoading} variant="default" onClick={() => sendOrder(eventInfo[0].eventId, cart, userSess[0].user)}>
						{language ? 
						isLoading ? "Checking out" : "Checkout now"
						:
						isLoading ? "Odesílání" : "Odeslat objednávku"
						}	
						</Button>
					:
					/* checking out if user is host */
					<div className="relative">
						<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="default" >
								{language? 
								"Checkout now"
								: 
								"Odeslat objednávku" 
								}
							</Button>
						</DropdownMenuTrigger>						
						<DropdownMenuContent className="w-[275px] absolute z-10 bottom-0 right-0">
							<DropdownMenuLabel>{language?  "Login or fill out the required credencials" :  "Přihlaste se nebo vyplňte požadované údaje" }</DropdownMenuLabel>
							<DropdownMenuSeparator/>
							<DropdownMenuGroup className="space-y-5 p-4">
								<input className="bg-white" type="text" placeholder="First Name" value={hostFirstName} onChange={e => setHostFirstName(e.target.value)}/>
								<input className="bg-white" type="text" placeholder="Last Name" value={hostLastName} onChange={e => setHostLastName(e.target.value)}/>
								<input className="bg-white" type="text" placeholder="Email" value={hostEmail} onChange={e => setHostEmail(e.target.value)}/>
								<Button disabled={isLoading || Boolean(!hostFirstName) || Boolean(!hostLastName) || Boolean(!hostEmail)} variant="default" onClick={() => sendOrder(eventInfo[0].eventId, cart, {firstName: hostFirstName, lastName: hostLastName,email: hostEmail})}>
								{language ? 
									isLoading ? "Checking out" : "Checkout now"
								:
									isLoading ? "Odesílání" : "Odeslat objednávku"
								}	
								</Button>
							</DropdownMenuGroup>
						</DropdownMenuContent>
						</DropdownMenu>
					</div>
					}	
				</div>
			</nav>
		</div>
	);
}

export default App;
