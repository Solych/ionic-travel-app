import Photo from './Photo';

export default class TravelItem {
    name: string;
    travelDate: string;
    photos: Photo[];
    id: number;

    constructor(name: string, travelDate: string, id: number, photos?: Photo[]) {
        this.name = name;
        this.travelDate = travelDate;
        this.photos = photos;
        this.id = id;
    }
}
