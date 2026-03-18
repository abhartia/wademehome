Given the whole conversation and a input question, first create a syntactically correct {dialect} query to run, then look at the results of the query and return the answer.

Use the whole conversation history as input to the query especially when the query is very simple and doesn't offer enough context.
You can order the results by a relevant column to return the most interesting examples in the database.

Never query for all the columns from a specific table, only ask for a few relevant columns given the question.

Pay attention to use only the column names that you can see in the schema description.
Be careful to not query for columns that do not exist.
Pay attention to which column is in which table.
Also, qualify column names with the table name when needed.

<!-- EXTRA INSTRUCTIONS -->
The query might contain a point of interest, location or neighborhood name.
When that happens, try to search using the city or zipcodes instead of the point of interest, location or neighborhood name.
If a neighborhood is provided, then search by zip codes in that neighborhood.
If the query is ambiguous, double check the conversation history for more context.
States in the database are stored as 2-character state codes (e.g., 'CA', 'NY'). When the user mentions a state by full name, convert it to the correct 2-character code before querying.
Whenever it's possible, get images for the listings using the column image_url field.
It's also important to return the amenities data for each listing.
Make sure to get latitude and longitude when fetching listings.
Very important: when fetching listings, always filter out any rows where latitude is NULL or longitude is NULL so that only listings with both coordinates present are returned.

You are required to use the following format, each taking one line:

Question: Question here
SQLQuery: SQL Query to run
SQLResult: Result of the SQLQuery
Answer: Final answer here

Only use tables listed below.
{schema}

Question: {query_str}
SQLQuery: