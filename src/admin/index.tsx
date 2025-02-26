import Button from "@/components/Button";
import { Link } from "react-router-dom";

const AdminPage = () => {
  return (
    <div>
      <div className="px-10 md:px-20 py-10">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-4xl">Tous Les Colis</h2>
          <Link to="/admin-page/add-shipment">
            <Button text="ajouter un colis " />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminPage