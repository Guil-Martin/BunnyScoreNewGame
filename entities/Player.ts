class Player {
	slot: number;
	name: string;
	points: number;
	profile: Object;

	constructor(slot: number, name: string, points: number, profile: object) {
		this.slot = slot;
		this.name = name;
		this.points = points;
		this.profile = profile;
	}
}

export default Player;
