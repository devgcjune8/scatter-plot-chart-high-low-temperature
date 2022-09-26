import { 
  select, 
  csv,
	scaleLinear,
	axisLeft,
	axisBottom,
  axisRight,
	extent,
  scaleBand,
  max,
  min
} from 'd3';

csv('data_temp.csv').then(data => {
			data.forEach(d => {
        d.hightemperature = (+d.hightemperature-32)/1.8
        d.lowtemperature = (+d.lowtemperature-32)/1.8
      })
  render(data)
})

const svg = select('svg')

const width = +svg.attr('width')
const height = +svg.attr('height')

const render = data => {
		const title = 'San Jose del Monte Average High and Low Temperature in Celsius Per Month'
		
    const xValue = d => d.month
    const xLabel = "Months"
    
    const yValue = d => d.hightemperature
    const yLabel = "High Temperature"
    
    const zValue = d => d.lowtemperature
    const zLabel = "Low Temperature"
    
    const circleRadius = 12;
		const margin = {top: 45, right: 30, left: 90, bottom:75}
    const innerWidth = width - margin.left - margin.right;
  	const innerHeight = height - margin.top - margin.bottom;
  
  	const xScale = scaleBand()
    								.domain(data.map(xValue))
  									.range([0, innerWidth])
  									.padding(0.25)

    const yScale = scaleLinear()
    								.domain([21, 34]) //hardcoded, will figure out later
    								.range([innerHeight, 0])
    								.nice()
  
    const g = svg.append('g')
    						 .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    const xAxis = axisBottom(xScale)
    							.tickSize(-innerHeight)
    							.tickPadding(10)
    
    const xAxisG = g.append('g')
    								.call(xAxis)
    								.attr('transform', `translate(-25, ${innerHeight})`)

    const yAxis = axisLeft(yScale)
    							.tickSize(-innerWidth)
    							.tickPadding(8)
    
    const yAxisG = g.append('g')
    								.call(yAxis)
    								.attr('transform', `translate(-25, 0)`)
    
    yAxisG.selectAll('.domain').remove()
  
    yAxisG.append('text')
  					.attr('class', 'axis-y-label')
  					.attr('y', -90)
  					.attr('x', -innerHeight / 2)
  					.attr('fill', 'black')
  
  
  
  	g.append('text')
  		.attr('id', 'title')
  		.text(title)
  		.attr('y', -10)
  		.attr('x', 90)
  
  	const highTempCircles = g.selectAll('circle').data(data)
  		.enter().append('circle')
  		.attr('cy', d => yScale(yValue(d)))
  		.attr('cx', d => xScale(xValue(d)))
  		.attr('r', circleRadius)
  		.attr('class', 'hightemp')
    	.append('title')
  	  .text(yValue)
    	.attr('class', 'temp-tip')
  
  	const lowTempCircles = 
          g.append('g')
    			 .selectAll('circle').data(data)
  				 .enter().append('circle')
  				 .attr('cy', d => yScale(zValue(d)))
  				 .attr('cx', d => xScale(xValue(d)))
  				 .attr('r', circleRadius)
  				 .attr('class', 'lowtemp')
    			 .append('title')
  	       .text(zValue)
    			 .attr('class', 'temp-tip');
  	
    const tempTip = document.querySelectorAll('.temp-tip')
    tempTip.forEach(addCentigrade)
    
    function addCentigrade(temp) {
       let celsiusFloat = parseFloat(temp.innerHTML);
       return temp.innerHTML = `${celsiusFloat.toFixed(1)} °C`
    }   
}
