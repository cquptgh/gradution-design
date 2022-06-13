const { createWriteStream } = require('fs')
const { resolve } = require('path')

function writeFile(pointList, vehicle_number) {
  let dimension = pointList.length
  const writePar = createWriteStream(resolve(__dirname, '../parameter.txt'))
  const writePro = createWriteStream(resolve(__dirname, '../problem.txt'))
  if (vehicle_number > 1) {
    const capacity = Math.ceil(dimension / vehicle_number)
    // 多车辆配送
    writePar.write(
      `PROBLEM_FILE=problem.txt\nRUNS=1\nMTSP_SOLUTION_FILE=result.txt`
    )
    writePar.end()
    writePro.write(
      `NAME:problem.txt\nTYPE:CVRP\nDIMENSION:${dimension}\nVEHICLES:${vehicle_number}\nCAPACITY:${capacity}\nEDGE_WEIGHT_TYPE:GEO\nDISPLAY_DATA_TYPE:COORD_DISPLAY\nNODE_COORD_SECTION\n`
    )
    pointList.forEach((point, index) => {
      writePro.write(
        `${index + 1} ${point['longitude']} ${point['latitude']} \n`
      )
    })
    writePro.write('DEMAND_SECTION\n')
    pointList.forEach((point, index) => {
      writePro.write(`${index + 1} ${index === 0 ? 0 : 1}\n`)
    })
    writePro.write('DEPOT_SECTION\n1\n-1\nEOF')
    writePro.end()
  } else {
    // 单车辆配送
    writePar.write(
      'PROBLEM_FILE=problem.txt\nRUNS=1\nOUTPUT_TOUR_FILE=result.txt'
    )
    writePar.end()
    writePro.write(
      `NAME:problem.txt\nTYPE:TSP\nDIMENSION:${dimension}\nEDGE_WEIGHT_TYPE:GEO\nDISPLAY_DATA_TYPE:COORD_DISPLAY\nNODE_COORD_SECTION\n`
    )
    pointList.forEach((point, index) => {
      writePro.write(
        `${index + 1} ${point['longitude']} ${point['latitude']} \n`
      )
    })
    writePro.write('EOF')
    writePro.end()
  }
}

module.exports = writeFile
