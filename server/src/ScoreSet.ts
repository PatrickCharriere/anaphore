import { Score } from './Score';

interface Log {
    userId: string,
    scored: number,
}

export class ScoreSet  {

    private _log: Log
    private _scores: Score[]
    
}