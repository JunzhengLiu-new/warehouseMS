import React from "react"
import Memory_utils from "../../../utils/Memory_utils"
import {req_role_show} from "../../../api/index"
import * as d3 from 'd3'
import { req_commodity,req_commodity_item_detail} from "../../../api"
import Category from "../Product_M/Category/Category"
export default class Bar extends React.Component{
    state = {
        chart_management:true,
        commodity:[]

    }
    chart = React.createRef()
    get_role = async() => {
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_role_show(user,"","user_role")
        if (response.data.resCode === 0){
            var user_role = response.data.responseDatas
            this.setState({
                chart_management:user_role[0].chart
            })
        }
    }    
    async drawChart() {
        var data = []
        // console.log(this.state.commodity)
        for(let i of this.state.commodity){
            // console.log(i)
            data.push({commodity:i.name,quantity:i.description})
        }   
            const width = 1000;
            const height = 650;
            const margin = {top:40, bottom: 40, left: 40, right: 40};
            
            const svg = d3.select(this.chart.current) //注意
                .append('svg')
                .attr('height', height - margin.top - margin.bottom)
                .attr('width', width - margin.left - margin.right)
                .attr('viewBox', [0, 0, width, height])
            
            const x = d3.scaleBand()
                .domain(d3.range(data.length))
                .range([margin.left, width - margin.right])
                .paddingInner(0.1);
            // alert(x(1))
            
            const y = d3.scaleLinear()
                .domain([0, 800])
                .range([height - margin.bottom, margin.top])
                svg
                .append("g")
                .attr("fill", 'royalblue')
                .selectAll("rect")
                .data(data.sort((a, b) => d3.descending(a.quantity, b.quantity)))
                .join("rect")
                      .attr("x", (d,i) => x(i))
                      .attr("y", d => y(d.quantity))
                      .attr('height', d=> y(0) - y(d.quantity))
                      .attr('width', x.bandwidth());
              
              function yAxis(g) {
                g.attr("transform", `translate(${margin.left}, 0)`)
                  .call(d3.axisLeft(y).ticks(null, data.format))
                  .attr("font-size", '20px')
              }
              
              function xAxis(g) {
                g.attr("transform", `translate(0,${height - margin.bottom})`)
                  .call(d3.axisBottom(x).tickFormat(i => data[i].commodity))
                  .attr("font-size", '20px')
              }
              
              svg.append("g").call(xAxis);
              svg.append("g").call(yAxis);
              svg.node();
      }
    load_category_data = async () => {
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_commodity(user,'','')
        var commodity_list = []
        if (response.data.resCode === 0){
            for(let c of response.data.responseData.commodity){
                commodity_list.push(c)
            }
            this.setState({
                commodity:this.state.commodity.concat(commodity_list)
            })
        }
        this.drawChart()
        console.log(this.state.commodity)
    }
    UNSAFE_componentWillMount(){
        this.get_role()
        this.load_category_data()
    }
    componentDidMount() {
        // this.drawChart();
      }
    render(){
  
        if(this.state.chart_management === true){
            return(
                <div ref={this.chart} style={{'height':'580px'}}></div>
            )
        }
        else{
            return(            
                <div style={{"fontSize":"20px"}}>
                Admin authorization is required to enable product-related functions
                </div>
                )
        }

    }
}