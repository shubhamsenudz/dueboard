package in.senudz.dueboard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;
@RestControllerAdvice
public class ApiErrors {
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String,String>> handle(RuntimeException e) {
        String msg = e.getMessage() == null ? "Request failed" : e.getMessage();
        int code = msg.toLowerCase().contains("invalid") ? 401 : 400;
        return ResponseEntity.status(code).body(Map.of("error", msg));
    }
}
