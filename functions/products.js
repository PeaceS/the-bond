export async function onRequestGet(context) {
  try {
    const { env } = context;

    const url = new URL(context.request.url);
    const excludeIdsString = url.searchParams.get('excludeIds');

    let query = "SELECT * FROM bonds WHERE sold = FALSE";
    let params = [];

    if (excludeIdsString) {
      // Split the string into an array of IDs and convert them to numbers
      const excludeIds = excludeIdsString.split(',').map(id => parseInt(id, 10));
      
      // Create a string of placeholders (?, ?, ?) for the IN clause
      const placeholders = excludeIds.map(() => '?').join(', ');

      // Append the NOT IN clause to the query
      query += ` AND id NOT IN (${placeholders})`;
      
      // Add the IDs to the parameters array
      params = excludeIds;
    }

    // Add the remaining parts of the query
    query += " ORDER BY random() LIMIT 2";
    
    // Use prepare() to safely execute the query with parameters
    const { results } = await env.DB.prepare(query).bind(...params).all();
    
    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return new Response(`Error fetching bonds: ${err.message}`, { status: 500 });
  }
}
