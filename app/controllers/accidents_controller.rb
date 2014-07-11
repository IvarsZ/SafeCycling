class AccidentsController < ApplicationController

  def create_accident
    respond_to do |format|
      
      @accident = Accident.new(accident_params)
      if @accident.save
        format.json {render json: {success: true}}    
      end
    end
  end 

  private
    
    def accident_params
      puts "TEST"
      puts params
      puts "END TEST"
      params.require(:accident).permit(:time, :severity, :vehicle, :lat, :lng)
    end
end
