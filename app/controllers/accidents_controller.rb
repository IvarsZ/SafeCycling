class AccidentsController < ApplicationController

  def index
    if (@ip = Ip.find_by_ip(request.env['REMOTE_ADDR'])).nil?
      Ip.create(ip: request.env['REMOTE_ADDR'], times_visited: 1, accidents_submitted: 0)
    else
      puts @ip.inspect
      @ip.times_visited += 1  
      @ip.save 
    end
  end

  def create_accident
    respond_to do |format|
    
      # Limit submissions per hour 
      @ip = Ip.find(request.env['REMOTE_ADDR'])
      
      if @ip.hourly_accidents_timer.nil?
        @ip.hourly_accidents_timer = DateTime.now
        puts "1 ", @ip.hourly_accidents_timer
        @ip.accidents_in_last_hour = 0
      end

      puts Time.new
      puts @ip.hourly_accidents_timer
      if Time.new - @ip.hourly_accidents_timer > 1.hours
        @ip.hourly_accidents_timer = DateTime.now
        puts "2", @ip.hourly_accidents_timer
        @ip.accidents_in_last_hour = 1
        @ip.accidents_submitted += 1
      elsif @ip.accidents_in_last_hour >= 10
        format.json {render json: {success: false, error: "Too many submissions per hour" } }
      else
        @ip.accidents_in_last_hour += 1
        @ip.accidents_submitted += 1
      end
      @ip.save
      
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
      params.require(:accident).permit(:time, :severity, :vehicle, :lat, :lng)
    end
end
