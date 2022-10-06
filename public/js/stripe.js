export const booking = async (tourId)=>{
    // book-tour
    
    const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY)
    const session =  await axios(`/api/v1/bookings/cookies-session/${tourId}`) 
    await stripe.redirectToCheckout({sessionId : session.data.session.id})
    
}