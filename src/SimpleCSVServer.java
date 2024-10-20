import com.opencsv.CSVReader;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class SimpleCSVServer {
    // Define constants for the column indices, excluding the first column
    private static final int STATUS_INDEX = 1;
    private static final int DESCRIPTION_INDEX = 2;
    private static final int AMOUNT_INDEX = 3;
    private static final int DEBIT_CREDIT_INDEX = 4;
    private static final int FROM_TO_INDEX = 5;
    private static final int DATE_INDEX = 6;

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/upload-csv", new CSVHandler());

        // Add CORS support
        server.createContext("/", exchange -> {
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
            sendResponse(exchange, 200, "");
        });

        server.setExecutor(null); // Use the default executor
        server.start();
        System.out.println("Server started on port 8080");
    }

    static class CSVHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Handle CORS preflight request
            if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
                exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
                exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");
                sendResponse(exchange, 204, "");
                return;
            }

            // Set CORS headers for actual request
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");

            try {
                // Read the multipart form data
                InputStream requestBody = exchange.getRequestBody();
                BufferedReader reader = new BufferedReader(new InputStreamReader(requestBody));
                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.trim().isEmpty()) break;
                }

                // Process CSV content and parse transactions
                List<Transaction> transactions = getTransactions(reader);

                // Calculate totals and group expenses by description
                double totalIncome = 0.0;
                double totalExpense = 0.0;
                Map<String, Double> expenseByDescription = new HashMap<>();
                Map<String, List<Transaction>> transactionsByDescription = new HashMap<>();

                for (Transaction transaction : transactions) {
                    if (transaction.isCredit()) {
                        totalIncome += transaction.getAmount();
                    } else {
                        totalExpense += transaction.getAmount();
                        expenseByDescription.put(transaction.getDescription(),
                                expenseByDescription.getOrDefault(transaction.getDescription(), 0.0) + transaction.getAmount());
                        transactionsByDescription
                                .computeIfAbsent(transaction.getDescription(), k -> new ArrayList<>())
                                .add(transaction);
                    }
                }

                // Prepare JSON response
                JSONObject responseJson = new JSONObject();
                responseJson.put("totalIncome", totalIncome);
                responseJson.put("totalExpense", totalExpense);

                JSONArray expensesArray = new JSONArray();
                for (Map.Entry<String, Double> entry : expenseByDescription.entrySet()) {
                    JSONObject expenseJson = new JSONObject();
                    expenseJson.put("description", entry.getKey());
                    expenseJson.put("amount", entry.getValue());

                    // Include transaction details for each description
                    JSONArray transactionsArray = new JSONArray();
                    List<Transaction> relatedTransactions = transactionsByDescription.get(entry.getKey());
                    if (relatedTransactions != null) {
                        for (Transaction t : relatedTransactions) {
                            JSONObject transactionJson = new JSONObject();
                            transactionJson.put("status", t.getStatus());
                            transactionJson.put("description", t.getDescription());
                            transactionJson.put("amount", t.getAmount());
                            transactionJson.put("credit", t.isCredit());
                            transactionJson.put("person", t.getPerson());
                            transactionJson.put("date", t.getDate());
                            transactionsArray.put(transactionJson);
                        }
                    }

                    expenseJson.put("transactions", transactionsArray);
                    expensesArray.put(expenseJson);
                }

                responseJson.put("expenses", expensesArray);
                String response = responseJson.toString();

                // Send JSON response
                sendResponse(exchange, 200, response);
            } catch (Exception e) {
                e.printStackTrace();
                String errorMessage = "Error processing file: " + e.getMessage();
                sendResponse(exchange, 400, errorMessage);
            }
        }

        private List<Transaction> getTransactions(BufferedReader reader) {
            List<Transaction> transactions = new ArrayList<>();
            try (CSVReader csvReader = new CSVReader(reader)) {
                String[] columnTitles = csvReader.readNext();
                List<String[]> rows = csvReader.readAll();

                for (String[] row : rows) {
                    if (row.length != columnTitles.length) continue;

                    try {
                        String status = row[STATUS_INDEX];
                        String description = row[DESCRIPTION_INDEX];
                        double amount = Double.parseDouble(row[AMOUNT_INDEX]);
                        boolean credit = row[DEBIT_CREDIT_INDEX].equalsIgnoreCase("זיכוי");
                        String person = row[FROM_TO_INDEX];
                        String date = row[DATE_INDEX];

                        if (status.equalsIgnoreCase("ההעברה בוצעה")) {
                            Transaction transaction = new Transaction(status, description, amount, credit, person, date);
                            transactions.add(transaction);
                        }
                    } catch (NumberFormatException e) {
                        System.out.println("Invalid amount format in row: " + Arrays.toString(row));
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
            return transactions;
        }
    }

    // Generic method to send a response to the client
    private static void sendResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }
}
