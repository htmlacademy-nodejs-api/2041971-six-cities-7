import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData } from '../../types/mock-server-data.type.js';
import { generateRandomValue, getRandomInt, getRandomItem, getRandomItems, getRandomSubarray } from '../../helpers/common.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const name = getRandomItem<string>(this.mockData.name);
    const description = getRandomItem<string>(this.mockData.description);
    const publicationDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.city);
    const previewImage = getRandomItem<string>(this.mockData.previewImage);
    const photos = getRandomSubarray<string>(this.mockData.photos, 6).join(';');
    const isPremium = getRandomItem<string>(this.mockData.isPremium);
    const isFavorite = getRandomItem<string>(this.mockData.isFavorite);
    const rating = Math.round((Math.random() * 4 + 1) * 10) / 10;
    const housingType = getRandomItem<string>(this.mockData.housingType);
    const rooms = getRandomInt(1, 8);
    const visiters = getRandomInt(1, 8);
    const price = getRandomInt(100, 100000);
    const amenities = getRandomItems<string>(this.mockData.amenities).join(';');
    const author = getRandomItem<string>(this.mockData.author);//TODO
    const coordinates = getRandomItem(this.mockData.coordinates);
    const commentsCount = getRandomInt(1, 50);
    const {latitude, longitude} = coordinates;

    return [
      name,
      description,
      publicationDate,
      city,
      previewImage,
      photos,
      isPremium,
      isFavorite,
      rating,
      housingType,
      rooms,
      visiters,
      price,
      amenities,
      author,
      commentsCount,
      latitude,
      longitude
    ].join('\t');
  }
}
