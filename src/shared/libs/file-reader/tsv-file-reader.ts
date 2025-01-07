import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';
import { Offer } from '../../types/index.js';
import { Amenity, City, HousingType } from '../../types/offer.type.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384;

  constructor(
    private readonly filename: string
  ) {
    super();
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
      latitude,
      longitude,
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
      coordinates: {latitude: Number(latitude), longitude: Number(longitude)}
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
