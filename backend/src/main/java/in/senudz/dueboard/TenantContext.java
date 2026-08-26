package in.senudz.dueboard;
public class TenantContext {
    private static final ThreadLocal<Long> T=new ThreadLocal<>();
    private static final ThreadLocal<Long> U=new ThreadLocal<>();
    public static void set(Long tenantId, Long userId){ T.set(tenantId); U.set(userId); }
    public static Long getTenantId(){ return T.get(); }
    public static Long getUserId(){ return U.get(); }
    public static void clear(){ T.remove(); U.remove(); }
}
