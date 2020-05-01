export type DullahanCookie = {
    name: string;
    value: string;
    domain?: string;
    path?: string;
    expires?: number;
    size?: number;
    httpOnly?: boolean;
    secure?: boolean;
    session?: boolean;
    sameSite?: 'Strict' | 'Lax' | 'None';
};
