import {Destination} from "./destination";

export type PlaceSuggestion = {
    placeId: string;
    description: string;
}

export type PlaceDetails = Destination & {address: string};