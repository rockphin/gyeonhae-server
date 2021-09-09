import { Service } from 'typedi';
import { fromBrailleToBrf } from 'braille.js';

@Service()
export default class BrailleService {
  public toAscii(braille: string) {
    return fromBrailleToBrf(braille);
  }
}
