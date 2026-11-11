import { v4, v7 } from "uuid";

type IdType = "v4" | "v7";

export function generateId(idType: IdType = "v4") {
	switch (idType) {
		case "v4":
			return v4;
		case "v7":
			return v7;
	}
}
