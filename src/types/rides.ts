export type CreateRide = {
    destination: {
        name: string,
        lat: number,
        long: number,
    },
    rideName: string
}

export type RideDetails = {
    rideId: string,
    inviteCode: string,
    destination: {
        name?: string,
        lat: number,
        long:  number,
    },
    status: string,
    createdBy?: string
};

export type RideMembers = {
  userId: string;
  name: string | null;
  phoneNumber: string;
  role: "OWNER" | "MEMBER";
}[];