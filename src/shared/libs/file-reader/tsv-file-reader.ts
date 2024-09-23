import { readFileSync } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/index.js';
import { Amenity, City, HousingType } from '../../types/offer.type.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      name,
      description,
      createdDate,
      city,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      housingType,
      rooms,
      guests,
      rentalCost,
      amenities,
      author,
      commentsCount,
      coordinates,
    ] = line.split('\t');

    return {
      name,
      description,
      publicationDate: new Date(createdDate),
      city: city as City,
      previewImage,
      photos: this.parseStringToArray(photos),
      isPremium: this.parseBoolean(isPremium),
      isFavorite: this.parseBoolean(isFavorite),
      rating: Number(rating),
      housingType: housingType as HousingType,
      rooms: Number(rooms),
      guests: Number(guests),
      rentalCost: Number(rentalCost),
      amenities: this.parseStringToArray(amenities) as Amenity[],
      author,
      commentsCount: Number(commentsCount),
      coordinates: {latitude: Number(coordinates.split(',')[0]), longitude: Number(coordinates.split(',')[1])}
    };
  }

  private parseStringToArray(photosString: string): string[] {
    return photosString.split(';').map((photo) => photo);
  }

  private parseBoolean(data: string): boolean {
    if (data === 'true') {
      return true;
    }
    return false;
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
