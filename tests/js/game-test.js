QUnit.test('test score',function(assert){
   assert.equal( 0, score, "score is 0 at the beginning" );
});
QUnit.test('test game',function(assert){
  assert.ok(game,true, "game is initialized");
});
