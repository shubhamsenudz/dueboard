package in.senudz.dueboard;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
public class IndiaLinks {
    public static String digits(String phone) {
        if (phone == null) return "";
        return phone.replaceAll("\\D", "");
    }
    public static String wa(String phone, String text) {
        String d = digits(phone);
        if (d.length() == 10) d = "91" + d;
        if (d.length() < 11) return "";
        String t = text == null ? "" : text;
        return "https://wa.me/" + d + "?text=" + URLEncoder.encode(t, StandardCharsets.UTF_8);
    }
    public static String upi(String vpa, Integer amount, String note) {
        if (vpa == null || vpa.isBlank()) return "";
        int am = amount == null ? 0 : amount;
        String n = note == null ? "" : note;
        return "upi://pay?pa=" + URLEncoder.encode(vpa, StandardCharsets.UTF_8)
            + "&am=" + am + "&cu=INR&tn=" + URLEncoder.encode(n, StandardCharsets.UTF_8);
    }
    public static String applyTemplate(String template, String fallback, String name, String amount, String extra) {
        String t = (template == null || template.isBlank()) ? fallback : template;
        return t.replace("{name}", name == null ? "" : name)
            .replace("{amount}", amount == null ? "" : amount)
            .replace("{extra}", extra == null ? "" : extra);
    }
}
