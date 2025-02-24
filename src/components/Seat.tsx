import { Button } from '@/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';
import React, { useState } from 'react';


interface SeatProps extends React.HTMLAttributes<HTMLElement> {
	addToCart: (
				typeId: string,
				seatId: number, 
				price: number) => void,  
	deleteFromCart: (
					seatId: number, 
					price: number) => void,
	seat: {
		seatId: number;
		place: number;
		ticketTypeId: string;
	};
	type: {
		id: string,
		name: string,
		price: number
	}
	language: boolean
}

export const Seat = React.forwardRef<HTMLDivElement, SeatProps>((props, ref) => {
	const [isInCart, setIsInCart] = useState(false);

	return (
		<Popover>
			{/* Seat icon */}
			<PopoverTrigger>
				<div className={cn(`size-8 rounded-full ${isInCart ? "bg-blue-500" : "bg-zinc-500"} hover:bg-zinc-800 transition-color`, props.className)}
					ref={ref}>
					<span className="text-xs text-white font-medium">{props.seat.place}</span>
				</div>
			</PopoverTrigger>
			{/* Ticket info */}
			<PopoverContent>
				<pre className='mb-5'>{ props.language ? `Ticket price ${props.type.price} \n Ticket type: ${props.type.name}` :`Cena lístku: ${props.type.price} \nTyp lístku: ${props.type.name === "Regular ticket" ? "Základní lístek" : "VIP lístek" }`}</pre>
				{/* Cart buttons */}
				<footer className="flex flex-col">{
					isInCart ? (
						<Button  variant="destructive" size="sm" onClick={() =>  {props.deleteFromCart(props.seat.seatId, props.type.price), setIsInCart(!isInCart)}}>
						{props.language ? 	"Remove from cart" : "Odebrat z košíku"}
						</Button>
					) : (
						<Button  variant="default" size="sm" onClick={() => {props.addToCart(props.seat.ticketTypeId, props.seat.seatId, props.type.price), setIsInCart(!isInCart)}}>
						{props.language ? 	"Add to cart" : "Přidat do košíku"}
						</Button>
					)
				}</footer>
			</PopoverContent>
		</Popover>
	);
});
