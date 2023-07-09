import React from "react"
import {Link, withRouter} from 'react-router-dom'
import Memory_utils from "../../../../utils/Memory_utils"
import { req_category_show,req_add_item_detail } from "../../../../api"
import Option_item from "./Option_item"
class Add_update extends React.Component{
    commodity_ref = React.createRef()
    description_ref = React.createRef()
    buying_price_ref = React.createRef()
    selling_price_ref = React.createRef()
    expiration_date_ref = React.createRef()
    category_ref = React.createRef()
    img_ref = React.createRef()
	state={
        commodity:"",
        description:"",
		buying_price:0,
        selling_price:0,
        expiration_date:'1900-00-00',
        category:"",
        state:"off sale",
        category_list:[]
    }
    UNSAFE_componentWillMount(){
        this.load_category_data()
    }
    load_category_data = async () => {
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const response = await req_category_show(user)
        if (response.data.resCode === 0){
            var category = response.data.responseData[0].category
            var sub_category = response.data.responseData[0]
            var category_list = []
            for(let c of category){
                if (sub_category[c] !== []){
                    category_list.push(c)
                    for(let sub_c of sub_category[c]){
                        category_list.push(`${c}/${sub_c}`)
                    }
                }
                else{
                    category_list.push(c)
                }     
            }
            this.setState({
                category_list:this.state.category_list.concat(category_list)
            })
    }
}
    save_commodity_data = async (event) => {
        event.preventDefault()
        const commodity = this.commodity_ref.current.value
        const description = this.description_ref.current.value
        const buying_price = this.buying_price_ref.current.value
        const selling_price = this.selling_price_ref.current.value
        const expiration_date = this.expiration_date_ref.current.value
        const category = this.category_ref.current.value
        const img_name = this.img_ref.current.value
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        const img_fileType = (img_name.substring(img_name.lastIndexOf(".") + 1, img_name.length)).toLowerCase()
        if(img_name !== ""){
            if(img_fileType === "jpg" || img_fileType === "jpeg" || img_fileType === "png"){
                console.log("Right image format")
            }
            else{
                alert("Wrong image format")
            }
        }
        if(!commodity || commodity.replace(/\s+/g,"").length < commodity.length){
            alert("Commodity can not include space")
            return
        }
        else if(!buying_price || !(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(buying_price))){
            alert("Invalid price entered")
            return
        }
        else if(!selling_price || !(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(selling_price))){
            alert("Invalid price entered")
            return
        }
        else if(!description || !(/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(selling_price))){
            alert("Invalid quantity entered")
            return
        }
        else{
            this.setState({
                commodity:commodity,
                description:description,
                buying_price:buying_price,
                selling_price:selling_price,
                expiration_date:expiration_date,
                category:category
            },async function(){
                const params = {
                    commodity_detail:{
                        name:this.state.commodity,
                        description:this.state.description,
                        buying_price:this.state.buying_price,
                        selling_price:this.state.selling_price,
                        expiration_date:this.state.expiration_date,
                        state:"off sale",
                        detail:{
                            category:this.state.category
                        }
                    }
                }
                const response = await req_add_item_detail(user,params,"detail")
                if (response.data.resCode === 0){
                    alert("Add new commodity successfully")
                    this.save_img()
                }
            })

        }
    }
    save_img = () => {
        const formData = new FormData()
        const commodityname = this.state.commodity
        const user = (Memory_utils.user.username).replace(/\"/g, "")
        formData.append("singlefile", this.img_ref.current.files[0])
        formData.append('username',user)
        formData.append('commodityname',commodityname)
        const endPoint = "/product/commodity/addupdate/img"
        const xhr = new XMLHttpRequest()
        xhr.open("post", endPoint, true)
        xhr.addEventListener("readystatechange", function(){
            if (xhr.status !== 200) {
                console.log("upload error", xhr.status, xhr.statusText, xhr.response);
              } else if (xhr.readyState === 4) {
                console.log(xhr.responseText.responseText)
              }
        })
        xhr.send(formData,user)
    }
 
  

    render(){
        return(
            <div style={{"margin":"auto","height":"580px","width":"96%"}}>
                <div><Link to={`/product/commodity`} style={{"float":"right","fontSize":"20px"}}>back</Link></div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                <form>
                    <div className="form-group">
                        <label>Commodity</label>
                        <input ref={this.commodity_ref} type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Quantity</label>
                        <input ref={this.description_ref} type="text" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Buying Price</label>
                        <div className="input-group">
                            <input ref={this.buying_price_ref} type="text" className="form-control"/>
                            <span className="input-group-addon">€</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Selling Price</label>
                        <div className="input-group">
                            <input ref={this.selling_price_ref} type="text" className="form-control"/>
                            <span className="input-group-addon">€</span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Expiration Date</label>
                        <div className="input-group">
                            <input ref={this.expiration_date_ref} type="text" className="form-control"/>
                            {/* <span className="input-group-addon">€</span> */}
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <select ref={this.category_ref} className="form-control">
                            {this.state.category_list.map((item,index) => <Option_item  option_item={item} load_category_data={this.load_category_data} key={index}/>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="exampleInputFile">Picture</label>
                        <input ref={this.img_ref} type="file"/>
                        <p className="help-block">Upload product images.</p>
                    </div>
                    <button  onClick={this.save_commodity_data} type="submit" className="btn btn-default">Submit</button>
                </form>
                </div>
                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
                    <img/>
                </div>

            </div>
        )
    }
}
export default withRouter(Add_update);