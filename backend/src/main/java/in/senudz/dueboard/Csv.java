package in.senudz.dueboard;
import java.util.*;
public class Csv {
    public static List<Map<String,String>> parse(String csv) {
        List<Map<String,String>> out = new ArrayList<>();
        if (csv == null || csv.isBlank()) return out;
        String[] lines = csv.trim().split("\\r?\\n");
        if (lines.length < 2) return out;
        String[] heads = Arrays.stream(lines[0].split(",")).map(s -> s.trim().replace("\"","")).toArray(String[]::new);
        for (int i = 1; i < lines.length; i++) {
            if (lines[i].isBlank()) continue;
            String[] cols = lines[i].split(",", -1);
            Map<String,String> row = new LinkedHashMap<>();
            for (int h = 0; h < heads.length && h < cols.length; h++) row.put(heads[h], cols[h].trim().replace("\"",""));
            out.add(row);
        }
        return out;
    }
}
