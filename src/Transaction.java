public class Transaction {
    String status;
    String description;
    double amount;
    boolean credit; // true if "זיכוי", false if "חיוב"
    String person;
    String date;

    // Constructor to initialize all fields
    Transaction(String status, String description, double amount, boolean credit, String person, String date) {
        this.status = status;
        this.description = description;
        this.amount = amount;
        this.credit = credit;
        this.person = person;
        this.date = date;
    }

    // Getters for each field if needed
    String getStatus() {
        return status;
    }

    String getDescription() {
        return description;
    }

    double getAmount() {
        return amount;
    }

    boolean isCredit() {
        return credit;
    }

    String getPerson() {
        return person;
    }

    String getDate() {
        return date;
    }

    @Override
    public String toString() {
        return "Transaction{" +
                "status='" + status + '\'' +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", credit=" + credit +
                ", person='" + person + '\'' +
                ", date='" + date + '\'' +
                '}';
    }
}
