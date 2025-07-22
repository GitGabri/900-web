import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function POST(request: any) {
  try {
    const body = await request.json()
    const { table, action, values, filters } = body

    if (!table || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing table or action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    let result: any

    switch (action) {
      case 'select':
        let selectQuery: any = supabase.from(table).select(values || '*')
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            selectQuery = selectQuery.eq(key, value)
          })
        }
        result = await selectQuery
        break

      case 'insert':
        if (!values) {
          return new Response(
            JSON.stringify({ error: 'Missing values for insert' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        result = await supabase.from(table).insert(values)
        break

      case 'update':
        if (!values || !filters) {
          return new Response(
            JSON.stringify({ error: 'Missing values or filters for update' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        let updateQuery: any = supabase.from(table)
        Object.entries(filters).forEach(([key, value]) => {
          updateQuery = updateQuery.eq(key, value)
        })
        result = await updateQuery.update(values)
        break

      case 'delete':
        if (!filters) {
          return new Response(
            JSON.stringify({ error: 'Missing filters for delete' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }
        let deleteQuery: any = supabase.from(table)
        Object.entries(filters).forEach(([key, value]) => {
          deleteQuery = deleteQuery.eq(key, value)
        })
        result = await deleteQuery.delete()
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
    }

    if (result.error) {
      return new Response(
        JSON.stringify({ error: result.error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify(result.data),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Supabase API error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
} 