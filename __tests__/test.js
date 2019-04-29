describe("Foobar", ()=>{


    var x = 3;

    test("Test x is 3", ()=>{


        expect(x).toBe(3);
        expect(x).not.toBe(5);

    });

})