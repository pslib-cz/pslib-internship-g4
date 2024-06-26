import { type NextRequest } from 'next/server'

export type PlaceCoordinates = {
    lat: number | null;
    lon: number | null;
}

export type PlaceLocation = {
    country: string;
    municipality: string;
    street: string;
    descNumber: string;
    orientNumber: number;
    postalCode: string;
    text: string;
}

export async function POST(request: NextRequest) {
    const body: PlaceLocation = await request.json();
    
    if (body.municipality === null) {
        return new Response("Insufficient data, please provide at least a municipality.", { status: 400 });
    }
    if (process.env.GEOCODING_ENGINE === "mapy.cz") {

        try {
            //console.log(`https://api.mapy.cz/v1/geocode?query=${body.street ? body.street : ""} ${body.descNumber ? body.descNumber : ""}/${body.orientNumber? body.orientNumber : ""}, ${body.municipality ? body.municipality : ""}, ${body.postalCode ? body.postalCode : ""}&limit=1&apikey=${process.env.MAPY_CZ_KEY}`);
            const response = await fetch(`https://api.mapy.cz/v1/geocode?query=${body.street ? body.street : ""} ${body.descNumber ? body.descNumber : ""}/${body.orientNumber? body.orientNumber : ""}, ${body.municipality ? body.municipality : ""}, ${body.postalCode ? body.postalCode : ""}&limit=1&apikey=${process.env.NEXT_PUBLIC_MAPY_CZ_KEY}`)
    
            if (response.ok) {
                const data = await response.json();
                //console.log(data);
                if (data.length === 0) {
                    return new Response("No data found", { status: 404 });
                }
                const place = data.items[0].position;
                const coord: PlaceCoordinates = { 
                    lat: place.lat, 
                    lon: place.lon
                };
                return new Response(JSON.stringify(coord), { status: 200 });
            } else {
                return new Response("Error fetching data", { status: 500 });
            }
        } catch (error) {
            if (error instanceof Error) {
                return new Response(error.message, { status: 500 });
            }
            else {
                return new Response("Some error occurred", { status: 500 });
            }
        }
    } else {
        // OpenStreetMap
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?street=${body.street ? body.street : ""} ${body.descNumber ?? ""}&city=${body.municipality ? body.municipality : ""}&format=json&limit=1`);
    
            if (response.ok) {
                const data = await response.json();
                if (data.length === 0) {
                    return new Response("No data found", { status: 404 });
                }
                
                const place = data[0];
                const coord: PlaceCoordinates = { 
                    lat: place.lat, 
                    lon: place.lon
                };
                
                return new Response(JSON.stringify(coord), { status: 200 });
            } else {
                return new Response("Error fetching data", { status: 500 });
            }
        } catch (error) {
            if (error instanceof Error) {
                return new Response(error.message, { status: 500 });
            }
            else {
                return new Response("Some error occurred", { status: 500 });
            }
        }
    }
    
}