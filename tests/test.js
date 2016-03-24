/**
 * Created by Ruslan on 09-Mar-16.
 */

describe("Testing main algorithm functions.", function () {

  describe("waveAlgorithm", function () {
    var testMaze = new Maze({
      height: 5,
      width: 5,
      cellSize: 32
    });

    it("Wave reaches the finish cell in default maze.", function () {
      testMaze.setWalls([[0, 1], [1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3], [4, 3]]);
      testMaze.setStart([0, 0]);
      testMaze.setFinish([4, 4]);

      assert.equal(testMaze.waveAlgorithm(), "success");
    })

  });

  describe("findPath", function () {

    var testMaze = new Maze({
      height: 5,
      width: 5,
      cellSize: 32
    });

    it("Finding shortest path in empty maze.", function () {
      testMaze.waveAlgorithm();
      testMaze.findPath();
      var path = testMaze.getPath();
      var result = [[1, 1], [2, 1], [2, 2], [3, 2], [3, 3]];
      assert.equal(path.length, result.length);

      for (var i in path) {
        assert.equal(path[i][0], result[i][0]);
        assert.equal(path[i][1], result[i][1]);
      }
    });

    it("Finding shortest path in default maze.", function () {
      testMaze.setWalls([[0, 1], [1, 1], [2, 1], [3, 1], [1, 3], [2, 3], [3, 3], [4, 3]]);
      testMaze.setStart([0, 0]);
      testMaze.setFinish([4, 4]);
      testMaze.waveAlgorithm();
      testMaze.findPath();
      var path = testMaze.getPath()
      var result = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [4, 1],
        [4, 2], [3, 2], [2, 2], [1, 2], [0, 2], [0, 3],
        [0, 4], [1, 4], [2, 4], [3, 4], [4, 4]];
      assert.equal(path.length, result.length);

      for (var i in path) {
        assert.equal(path[i][0], result[i][0]);
        assert.equal(path[i][1], result[i][1]);
      }
    });
  });

});
