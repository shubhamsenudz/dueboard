package in.senudz.dueboard;
import io.jsonwebtoken.Jwts; import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value; import org.springframework.stereotype.Service;
import javax.crypto.SecretKey; import java.nio.charset.StandardCharsets; import java.util.*;
@Service
public class JwtService {
    private final SecretKey key;
    public JwtService(@Value("${app.jwt-secret}") String secret){
        byte[] b = secret.getBytes(StandardCharsets.UTF_8);
        if(b.length<32) b = Arrays.copyOf(b,32);
        this.key = Keys.hmacShaKeyFor(b);
    }
    public String issue(AppUser u){
        return Jwts.builder().subject(String.valueOf(u.getId()))
            .claims(Map.of("tid", u.getTenantId(), "email", u.getEmail(), "role", u.getRole()))
            .issuedAt(new Date()).expiration(new Date(System.currentTimeMillis()+43200000L))
            .signWith(key).compact();
    }
    public io.jsonwebtoken.Claims parse(String token){
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
    }
}
