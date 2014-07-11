class CreateAccidents < ActiveRecord::Migration
  def change
    create_table :accidents do |t|
      t.datetime :time
      t.string :severity
      t.string :vehicle
      t.float :lat
      t.float :lng

      t.timestamps
    end
  end
end
