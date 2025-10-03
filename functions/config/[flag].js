export async function onRequestGet(context) {
  try {
    const { env, params } = context;

    const flagName = params.flag;
    const config = await env.CONFIG.get(flagName);
    return new Response(config);
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}
