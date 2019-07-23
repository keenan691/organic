import { measureItems } from "./useItems";


it("should measureItems", () => {
    expect(measureItems(['a', 'b', 'c'], [1, 1, 3])).toHaveLength(3)
})
