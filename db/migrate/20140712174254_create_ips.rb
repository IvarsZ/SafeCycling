class CreateIps < ActiveRecord::Migration
  def change
    create_table :ips,
    {
      id: false,
      primary_key: :ip
    } do |t|
      t.string :ip
      t.integer :times_visited
      t.integer :accidents_submitted
      t.integer :accidents_in_last_hour
      t.datetime :hourly_accidents_timer
      t.timestamps
    end
  end
end
