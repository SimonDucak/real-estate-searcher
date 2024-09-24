import { Advertise, advertiseParser, AdvertiseType } from "@/schemas/Advertise";
import axios from "axios";

export const getAdvartises = async (): Promise<Advertise[]> => {
    const saleUrl = "/for-sale-minified.json";
    const rentUrl = "/for-rent-minified.json";

    const [saleData, rentData] = await Promise.all([
        axios.get(saleUrl),
        axios.get(rentUrl),
    ]);

    const isAdvertise = (data: Advertise | null): data is Advertise => data !== null;

    const saleAdvartises = saleData.data.map((data: any) => advertiseParser(data, AdvertiseType.SALE));
    const rentAdvartises = rentData.data.map((data: any) => advertiseParser(data, AdvertiseType.RENT));

    return [...saleAdvartises, ...rentAdvartises].filter(isAdvertise);
}