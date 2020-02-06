import { Injectable } from '@nestjs/common';
import truckInfo from '../assets/truck-info';
import axios from 'axios';
const cheerio = require('cheerio');

interface Tweet {
    tweetTime: string;
    tweetText: string;
}
interface Truck {
    name: string,
    url: string
}
@Injectable()
export class ScrapperService {

    constructor() {}

    public initRepeatRequests(): void {
        Object.keys(truckInfo.data).forEach(key => {
            if (typeof truckInfo.data[key] === 'object') {
                this.makeReqForWebsite(
                    truckInfo.data.base_url + truckInfo.data[key].url,
                    truckInfo.data[key]
                );
            }
        });
    }

    private makeReqForWebsite(site: string, truck: Truck): void {
        axios
            .get(site)
            .then(res => {
                let formattedTweets: Array<Tweet> = this.scrapSite(res.data);
                let todaysTweets: Array<Tweet> = this.getTodaysTweets(
                    formattedTweets
                );
                if (this.checkIfTruckOnStreet(todaysTweets, 'hudson')) {
                    // store truck data to firebase database
                    console.log(truck.name);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }

    private scrapSite(siteData: object): Array<Tweet> {
        let $ = cheerio.load(siteData);
        let allTweet: any = $('.tweet');
        let headers: object = allTweet.find($('.tweet-timestamp'));
        let tweetTexts: object = allTweet.find($('.tweet-text'));
        let formattedTweets = [];
        Object.keys(tweetTexts).forEach(key => {
            let tweetData: any = {
                tweetTime: null,
                tweetText: ''
            };
            if (Number.isInteger(Number.parseInt(key))) {
                let tempText: string = '';
                tweetTexts[key].children.forEach(val => {
                    if (val.data && val.data.trim().length > 0) {
                        tempText += val.data.trim();
                    }
                });
                try {
                    tweetData.tweetText = tempText;
                    tweetData.tweetTime = headers[key].attribs.title;
                    formattedTweets.push(tweetData);
                } catch (e) {}
            }
        });
        return formattedTweets;
    }

    private getTodaysTweets(formattedTweets: Array<Tweet>): Array<Tweet> {
        let todaysTweets: Array<Tweet> = [];
        let dateToday: string;
        const date: Date = new Date(),
            locale: string = 'en-us',
            month: string = date.toLocaleString(locale, {
                month: 'short'
            });

        dateToday = `${date.getDate()} ${month} ${date.getFullYear()}`;
        formattedTweets.forEach(val => {
            let tweetDate = val!.tweetTime.split('-')[1].trim();

            if (dateToday == tweetDate) {
                todaysTweets.push(val);
            }
        });
        return todaysTweets;
    }

    checkIfTruckOnStreet(
        todaysTweets: Array<Tweet>,
        street: string,
        crossStreet = null
    ): boolean {
        let onStreet: boolean = false;
        let expr: any = /hudson/;
        todaysTweets.forEach((tweet: Tweet) => {
            if (expr.test(tweet.tweetText.toLocaleLowerCase())) {
                onStreet = true;
            }
        });
        return onStreet;
    }
}
