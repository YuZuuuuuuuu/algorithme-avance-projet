import { useRouter } from "next/navigation";
import { logout } from "@/utils/sessions";
 
export default function Nav() {
  // ...
  const router = useRouter();
 
  const Logout = () => {
    logout(); // Destroy the cookie
    return router.push("/login"); // redirect to login page
  };
 
  return (
    <nav>
      // ...
      <button onClick={Logout}>Logout</button>
    </nav>
  );
}