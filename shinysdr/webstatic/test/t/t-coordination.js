// Copyright 2015 Kevin Reid <kpreid@switchb.org>
// 
// This file is part of ShinySDR.
// 
// ShinySDR is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// ShinySDR is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with ShinySDR.  If not, see <http://www.gnu.org/licenses/>.

'use strict';

describe('Coordinator', function () {
  var block = shinysdr.values.block;
  var makeBlock = shinysdr.values.makeBlock;
  var ConstantCell = shinysdr.values.ConstantCell;
  
  // TODO reduce the need for this stubbing
  var stubRadioCell = new ConstantCell(block, makeBlock({
    source: new ConstantCell(block, makeBlock({
      freq: new ConstantCell(Number, 0),
    })),
    receivers: new ConstantCell(block, makeBlock(Object.create(Object.prototype, {
      create: {value: function () {}}
    }))),
  }));

  var stubTable = new shinysdr.database.Table('stubTable', false);
  
  it('selected record should follow tuning', function () {
    var coordinator = new shinysdr.coordination.Coordinator(
        "bogus scheduler", stubTable, stubRadioCell);
    var record = new shinysdr.database.Table('foo', true).add({});
    
    expect(coordinator.actions.selectedRecord.get()).toBe(undefined);
    coordinator.actions.tune({record: record});
    expect(coordinator.actions.selectedRecord.get()).toBe(record);
    coordinator.actions.tune({freq: 1});  // not a record
    expect(coordinator.actions.selectedRecord.get()).toBe(record);  // unchanged
  });
});

testScriptFinished();
