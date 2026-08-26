package in.senudz.dueboard;
import jakarta.persistence.*;
@Entity @Table(name="tenants")
public class Tenant {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    private String name; private String city; private String phone; private String gstin;
    private String upiVpa; private String whatsapp; private String address; private String reminderTemplate;
    private String createdAt;
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getName(){return name;} public void setName(String name){this.name=name;}
    public String getCity(){return city;} public void setCity(String city){this.city=city;}
    public String getPhone(){return phone;} public void setPhone(String phone){this.phone=phone;}
    public String getGstin(){return gstin;} public void setGstin(String gstin){this.gstin=gstin;}
    public String getUpiVpa(){return upiVpa;} public void setUpiVpa(String upiVpa){this.upiVpa=upiVpa;}
    public String getWhatsapp(){return whatsapp;} public void setWhatsapp(String whatsapp){this.whatsapp=whatsapp;}
    public String getAddress(){return address;} public void setAddress(String address){this.address=address;}
    public String getReminderTemplate(){return reminderTemplate;} public void setReminderTemplate(String reminderTemplate){this.reminderTemplate=reminderTemplate;}
    public String getCreatedAt(){return createdAt;} public void setCreatedAt(String createdAt){this.createdAt=createdAt;}
}
