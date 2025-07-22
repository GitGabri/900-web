const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  // Expected payload: { table, action, values, filters }
  const { table, action, values, filters } = payload;
  if (!table || !action) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing table or action' }),
    };
  }

  let query = supabase.from(table);
  let result;

  try {
    switch (action) {
      case 'select':
        query = query.select(values || '*');
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            query = query.eq(key, value);
          });
        }
        result = await query;
        break;
      case 'insert':
        if (!values) throw new Error('Missing values for insert');
        result = await query.insert(values);
        break;
      case 'update':
        if (!values || !filters) throw new Error('Missing values or filters for update');
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        result = await query.update(values);
        break;
      case 'delete':
        if (!filters) throw new Error('Missing filters for delete');
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
        result = await query.delete();
        break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' }),
        };
    }
    if (result.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: result.error.message }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 