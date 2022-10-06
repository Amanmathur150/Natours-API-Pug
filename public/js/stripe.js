export const booking = async (tourId)=>{
    // book-tour
    
    const stripe = Stripe("pk_test_51LpUZjSDDIV3n6A0AFqsEcM4KYbiuf0mWuNB0XXqPrfsM2iYzmHJRVnfFyZDeTIZVkZYBTUqwIFzQym8qdajeNp000GBoMqB7M")
    const session =  await axios(`http://localhost:9000/api/v1/bookings/cookies-session/${tourId}`) 
    // console.log(session)
    await stripe.redirectToCheckout({sessionId : session.data.session.id})
    
}