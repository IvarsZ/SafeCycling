class AccidentsController < ApplicationController

  def index
    if (@ip = Ip.find_by_ip(get_ip)).nil?
      Ip.create(ip: get_ip, times_visited: 1, accidents_submitted: 0)
    else
      puts @ip.inspect
      @ip.times_visited += 1  
      @ip.save 
    end
  end

  def create_accident
    respond_to do |format|
    
      # Limit submissions per hour 
      @ip = Ip.find(get_ip)
      
      if @ip.hourly_accidents_timer.nil?
        @ip.hourly_accidents_timer = DateTime.now
        puts "1 ", @ip.hourly_accidents_timer
        @ip.accidents_in_last_hour = 0
      end

      record_accident = true
      if Time.new - @ip.hourly_accidents_timer > 1.hours
        @ip.hourly_accidents_timer = DateTime.now
        puts "2", @ip.hourly_accidents_timer
        @ip.accidents_in_last_hour = 1
        @ip.accidents_submitted += 1
      elsif @ip.accidents_in_last_hour >= 10
        format.json {render json: {success: false, error: "Too many submissions per hour" } }
        record_accident = false
      else
        @ip.accidents_in_last_hour += 1
        @ip.accidents_submitted += 1
      end
      @ip.save
      
      if record_accident
        @accident = Accident.new(accident_params)
        if @accident.save
          format.json {render json: {success: true}}    
        else
          format.json {render json: {success: false}}
        end
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

    def get_ip
      puts "!!!!!!!!!!!   IP   !!!!!!!!!!!!!"
      puts request.env['HTTP_X_FORWARDED_FOR'] || request.remote_ip
      puts "!!!!!!!!!!! END IP !!!!!!!!!!!!!"
      request.env['HTTP_X_FORWARDED_FOR'] || request.remote_ip
    end
end
