export type CreateRide = {
    destination: {
        name: string,
        lat: number,
        long: number,
    },
    rideName: string
}