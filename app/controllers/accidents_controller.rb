class AccidentsController < ApplicationController

  def create_accident
    respond_to do |format|
      
      @accident = Accident.new(accident_params)
      if @accident.save
        format.json {render json: {success: true}}    
      else
        format.json {render json: {success: false}}
      end
    end
  end 

  def all_accidents
    respond_to do |format|
      format.json {render json: Accident.all.to_json }
    end
  end

  private
    
    def accident_params
      puts params
      params.require(:accident).permit(:time, :severity, :vehicle, :lat, :lng)
    end
end
