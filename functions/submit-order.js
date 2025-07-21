export async function onRequestPost(context) {
  const data = await context.request.json();

  // You can send this to a webhook, store in DB, etc.
  console.log('Received PayPal order:', data);

  return new Response(JSON.stringify({ status: 'received' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
