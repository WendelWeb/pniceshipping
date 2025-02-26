import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-select";
import shipmentDetails from "../../assets/shared/shipmentDetails.json";
import InputField from "./InputField";
import DropdownField from "./DropdownField";
import IconField from "./IconField";
import {shipmentListing} from "../../../configs/schema.ts"
import { db } from "../../../configs/index.ts"

interface ShipmentItem {
  label: string;
  name: string;
  fieldType: string;
  required: boolean;
  column: number;
  icon: string;
  options?: string[];
}

interface ShipmentFormData {
  fullName?: string;
  userName?: string;
  emailAdress?: string;
  trackingNumber?: string;
  category?: string;
  weight?: number;
  status?: string;
  // [key: string]: any;
}

const AddShipment = () => {
  const [formData, setFormData] = useState<ShipmentFormData>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
    try {
      const insertData = {
        fullName: formData.fullName || '',
        userName: formData.userName || '',
        emailAdress: formData.emailAdress || '',
        trackingNumber: formData.trackingNumber || '',
        category: formData.category || '',
        weight: formData.weight?.toString() || '',
        status: formData.status || ''
      };
      
      const result = await db
        .insert(shipmentListing)
        .values(insertData);

      if (result) {
        console.log("success");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="">
      <div className="px-10 md:px-20 py-10">
        <h2 className="font-bold text-4xl">Ajouter un nouveau colis</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onFormSubmit(e);
          }}
          className="p-10 border rounded-xl mt-10"
        >
          <h2 className="font-medium text-xl mb-6">Détails du colis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {shipmentDetails.shipmentDetails.map(
              (item: ShipmentItem, index: number) => (
                <div
                  key={index}
                  className={`${
                    item.fieldType == "textarea" &&
                    "my-custom-breakpoint:col-span-2"
                  }`}
                >
                  <label className="flex gap-2 items-center text-gray-700 font-medium">
                    <IconField icon={item.icon} />
                    {item.label}
                    {item.required && <span className="text-red-500">*</span>}
                  </label>
                  {item.fieldType === "text" || item.fieldType === "number" ? (
                    <InputField
                      handleIputChange={handleInputChange}
                      item={item}
                    />
                  ) : (
                    item.fieldType === "dropdown" && (
                      <DropdownField
                        item={{
                          ...item,
                          options: item.options || [],
                        }}
                        handleInputChange={handleInputChange}
                      />
                    )
                  )}
                </div>
              )
            )}
          </div>
          <Separator className="my-6" />
          <div className="mt-6 flex justify-center">
            <Button
              type="submit"
              className="px-6 py-3 text-lg rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
            >
              Enregistrer le colis
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
