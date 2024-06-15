export type ListResult<T> = {
    data: T[]
    count: number
    total: number
    page: number | null
    size: number | null
}

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