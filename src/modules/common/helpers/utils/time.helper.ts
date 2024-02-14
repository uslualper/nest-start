import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeHelper {
    /**
     * Converts seconds to milliseconds.
     * @param seconds The number of seconds to convert.
     * @returns The equivalent value in milliseconds.
     */
    public secondsToMilliseconds(seconds: number): number {
        return seconds * 1000;
    }
}
